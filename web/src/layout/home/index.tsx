import isNull from 'lodash/isNull';
import React, { useEffect, useState } from 'react';
import { FaGithub, FaSlack } from 'react-icons/fa';

import { API } from '../../api';
import logo from '../../images/cncf.svg';
import { PackageKind, Stats } from '../../types';
import ExternalLink from '../common/ExternalLink';
import PackageIcon from '../common/PackageIcon';
import SearchBar from '../common/SearchBar';
import Counter from './Counter';
import styles from './HomeView.module.css';
import PackagesUpdates from './PackagesUpdates';
import UserConfirmation from './UserConfirmation';

interface Props {
  isSearching: boolean;
  emailCode?: string;
}

const HomeView = (props: Props) => {
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setIsLoadingStats(true);
    async function fetchStats() {
      try {
        setStats(await API.getStats());
      } catch {
        setStats(null);
      } finally {
        setIsLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className={`d-flex flex-column flex-grow-1 ${styles.home}`}>
      <div className={`jumbotron mb-0 text-center ${styles.jumbotron}`}>
        <div role="heading" className={`display-4 text-center font-weight-light ${styles.mainTitle}`}>
          Find, install and publish
          <br />
          Kubernetes packages
        </div>

        <div className="mt-5 text-center">
          <SearchBar formClassName={`m-auto w-50 ${styles.search}`} size="big" isSearching={props.isSearching} />
        </div>

        <div className="d-flex align-items-center justify-content-center mt-5">
          <Counter isLoading={isLoadingStats} value={isNull(stats) ? null : stats.packages} name="packages" />
          <div className={`ml-5 mr-5 ${styles.separator}`} />
          <Counter isLoading={isLoadingStats} value={isNull(stats) ? null : stats.releases} name="releases" />
        </div>

        <div className="mt-5 mb-2 text-center">
          <ExternalLink className={`btn btn-secondary ${styles.socialBtn}`} href="https://github.com/cncf/hub">
            <div className="d-flex align-items-center justify-content-center">
              <FaGithub className="mr-2" />
              GitHub
            </div>
          </ExternalLink>

          <ExternalLink
            className={`btn btn-secondary ml-3 ${styles.socialBtn}`}
            href="https://cloud-native.slack.com/channels/artifact-hub"
          >
            <div className="d-flex align-items-center justify-content-center">
              <FaSlack className="mr-2" />
              Slack
            </div>
          </ExternalLink>
        </div>
      </div>

      <PackagesUpdates />

      <div className={`py-5 ${styles.about}`}>
        <div className="container py-5">
          <div className="text-center">
            Artifact Hub is a web-based application that enables finding, installing, and publishing packages and
            configurations for CNCF projects. For example, this could include Helm charts, Falco configurations, and
            Open Policy Agent (OPA) policies.
            <div className="m-5 d-flex flex-row align-items-center justify-content-around">
              <PackageIcon kind={PackageKind.Chart} type="white" className={styles.aboutIcon} />
              <PackageIcon kind={PackageKind.Falco} type="white" className={styles.aboutIcon} />
              <PackageIcon kind={PackageKind.Opa} type="white" className={styles.aboutIcon} />
            </div>
            Discovering artifacts to use with CNCF projects can be difficult. If every CNCF project that needs to share
            artifacts creates its own Hub this creates a fair amount of repeat work for each project and a fractured
            experience for those trying to find the artifacts to consume. The Artifact Hub attempts to solve that by
            providing a single experience for consumers that any CNCF project can leverage.
          </div>
        </div>
      </div>

      <div
        data-testid="CNCFInfo"
        className="text-center align-items-center justify-content-center pb-5 pt-5 d-flex flex-grow-1"
      >
        <div>
          <img className={`${styles.logo} m-3`} src={logo} alt="Logo CNCF" />
          <div className="h5 px-3 pt-4">
            Artifact Hub aspires to be a{' '}
            <ExternalLink href="https://www.cncf.io/" className="font-weight-bold text-primary">
              Cloud Native Computing Foundation
            </ExternalLink>{' '}
            sandbox project.
          </div>
        </div>
      </div>

      <UserConfirmation emailCode={props.emailCode} />
    </div>
  );
};

export default HomeView;
