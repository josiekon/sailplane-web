import React, {useState} from 'react';
import {primary15, primary2, primary45} from './colors';
import {
  FaFolderOpen,
  FaCog,
  FaBars,
  FaServer,
  FaTimes,
  FaDownload,
} from 'react-icons/fa';
import {PanelItem} from './components/PanelItem';
import {useIsSmallScreen} from './hooks/useIsSmallScreen';
import {FaPaperPlane, FaGithub, FaHome} from 'react-icons/fa/index';
import logo from './logo.png';

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: primary45,
    color: '#FFF',
    padding: '20px 10px',
    minWidth: 200,
    fontFamily: 'Open Sans',
    paddingBottom: 0,
  },
  logo: {
    display: 'inline-block',
    fontFamily: 'MuseoModerno',
    color: '#FFF',
    fontSize: 24,
    fontWeight: 400,
    marginBottom: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    lineHeight: '24px',
  },
  settingsBlock: {
    bottom: 0,
    width: '100%',
  },
  mobilePadding: {
    paddingBottom: 6,
  },
  menuIcon: {
    position: 'absolute',
    top: 25,
    left: 14,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 13,
    lineHeight: '14px',
    fontFamily: 'Open Sans',
  },
  iconGithub: {
    cursor: 'pointer',
  },
  githubTxt: {
    fontSize: 10,
    userSelect: 'none',
  },
  icon: {
    position: 'relative',
    top: 6,
    width: 30,
    marginRight: 4,
  },
  logoTitle: {
    display: 'inline-flex',
  },
};

export function LeftPanel({
  setCurrentRightPanel,
  currentRightPanel,
  isDownload,
}) {
  const isSmallScreen = useIsSmallScreen();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  let iconComponent = FaBars;
  if (isMobileOpen) {
    iconComponent = FaTimes;
  }

  const IconComponent = iconComponent;

  return (
    <div style={styles.container}>
      {isSmallScreen ? (
        <IconComponent
          color={'#FFF'}
          size={24}
          style={styles.menuIcon}
          onClick={() => {
            setIsMobileOpen(!isMobileOpen);
          }}
        />
      ) : null}
      <div>
        <div style={styles.logoContainer}>
          <div
            style={styles.logo}
            onClick={() => {
              document.location = `${
                window.location.origin + window.location.pathname
              }`;
            }}>
            <img
              src={logo}
              style={styles.icon}
            />
            <div style={styles.logoTitle}>Sailplane</div>
          </div>
        </div>
        {(isMobileOpen || !isSmallScreen) && !isDownload ? (
          <>
            <PanelItem
              title={'Files'}
              iconComponent={FaFolderOpen}
              selected={currentRightPanel === 'files'}
              onClick={() => setCurrentRightPanel('files')}
            />
            <PanelItem
              title={'Drives'}
              iconComponent={FaServer}
              selected={currentRightPanel === 'instances'}
              onClick={() => setCurrentRightPanel('instances')}
            />

            <div style={styles.settingsBlock}>
              <PanelItem
                title={'Settings'}
                selected={currentRightPanel === 'settings'}
                onClick={() => setCurrentRightPanel('settings')}
                iconComponent={FaCog}
              />
            </div>
          </>
        ) : (
          <div style={styles.mobilePadding} />
        )}
        {isDownload ? (
          <>
            <div style={styles.settingsBlock}>
              <PanelItem
                title={'Home'}
                onClick={() => (document.location = '/')}
                iconComponent={FaHome}
              />
            </div>
            <div style={styles.settingsBlock}>
              <PanelItem
                title={'Downloads'}
                onClick={() => {}}
                iconComponent={FaDownload}
                selected={true}
              />
            </div>
          </>
        ) : null}
      </div>
      {!isSmallScreen ? (
        <div style={styles.footer}>
          <a
            href={'https://github.com/cypsela/sailplane-web'}
            target={'_blank'}>
            <FaGithub color={primary15} size={20} style={styles.iconGithub} />
          </a>
          <div style={styles.githubTxt}>Source</div>
        </div>
      ) : null}
    </div>
  );
}
