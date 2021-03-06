import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Package } from '../../types';
import buildPackageURL from '../../utils/buildPackageURL';
import prepareQuerystring from '../../utils/prepareQueryString';
import PackageCard from './PackageCard';

const getMockPackage = (fixtureId: string): Package => {
  return require(`./__fixtures__/packageCard/${fixtureId}.json`) as Package;
};

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockSaveScrollPosition = jest.fn();

const defaultProps = {
  saveScrollPosition: mockSaveScrollPosition,
  searchUrlReferer: null,
};

describe('PackageCard', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const mockPackage = getMockPackage('1');
    const { asFragment } = render(
      <Router>
        <PackageCard {...defaultProps} package={mockPackage} />
      </Router>
    );
    expect(asFragment).toMatchSnapshot();
  });

  describe('Image', () => {
    it('renders package logo', () => {
      const mockPackage = getMockPackage('2');
      const { queryByAltText } = render(
        <Router>
          <PackageCard {...defaultProps} package={mockPackage} />
        </Router>
      );
      const image = queryByAltText(`Logo ${mockPackage.displayName}`);
      expect(image).toBeInTheDocument();
    });

    it('renders placeholder when imageId is null', () => {
      const mockPackage = getMockPackage('3');

      const { queryByAltText } = render(
        <Router>
          <PackageCard {...defaultProps} package={mockPackage} />
        </Router>
      );
      const image = queryByAltText(`Logo ${mockPackage.displayName}`);
      expect(image).toBeInTheDocument();
      expect((image as HTMLImageElement).src).toBe('http://localhost/kubernetes_grey.svg');
    });
  });

  describe('Title', () => {
    it('renders display name', () => {
      const mockPackage = getMockPackage('4');

      const { queryByText } = render(
        <Router>
          <PackageCard {...defaultProps} package={mockPackage} />
        </Router>
      );
      const title = queryByText(mockPackage.displayName!);
      expect(title).toBeInTheDocument();
    });

    it('renders name when display name is null', () => {
      const mockPackage = getMockPackage('5');

      const { queryByText } = render(
        <Router>
          <PackageCard {...defaultProps} package={mockPackage} />
        </Router>
      );
      const title = queryByText(mockPackage.name!);
      expect(title).toBeInTheDocument();
    });
  });

  describe('Chart repository button', () => {
    it('renders repository link', () => {
      const mockPackage = getMockPackage('6');

      const { queryByTestId, queryByAltText } = render(
        <Router>
          <PackageCard {...defaultProps} package={mockPackage} />
        </Router>
      );
      const button = queryByTestId('repoLink');
      expect(button).toBeInTheDocument();
      const icon = queryByAltText('Icon');
      expect(icon).toBeInTheDocument();
      expect((icon as HTMLImageElement).src).toBe('http://localhost/helm.svg');
      fireEvent.click(button!);
      expect(mockHistoryPush).toHaveBeenCalledTimes(1);
      expect(mockHistoryPush).toHaveBeenCalledWith({
        pathname: '/packages/search',
        search: prepareQuerystring({
          pageNumber: 1,
          filters: {
            repo: [mockPackage.chartRepository!.name],
          },
          deprecated: false,
        }),
        state: { fromSearchCard: true },
      });
    });

    it('does not render repository link when chart kind is not Helm Chart', () => {
      const mockPackage = getMockPackage('7');

      const { queryByRole } = render(
        <Router>
          <PackageCard {...defaultProps} package={mockPackage} />
        </Router>
      );
      const button = queryByRole('button');
      expect(button).toBeNull();
    });
  });

  describe('Detail', () => {
    it('opens detail page', () => {
      const mockPackage = getMockPackage('8');
      const urlReferer = {
        text: 'test',
        filters: {},
        pageNumber: 1,
        deprecated: false,
      };
      const { queryByTestId } = render(
        <Router>
          <PackageCard {...defaultProps} package={mockPackage} searchUrlReferer={urlReferer} />
        </Router>
      );
      const link = queryByTestId('link');
      expect(link).toBeInTheDocument();
      fireEvent.click(link!);
      expect(mockSaveScrollPosition).toHaveBeenCalledTimes(1);
      expect(window.location.pathname).toBe(buildPackageURL(mockPackage));
    });
  });
});
