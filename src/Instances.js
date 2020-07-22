import React, {useEffect, useState} from 'react';
import {primary2, primary3, primary4, primary45} from './colors';
import {Instance} from './components/Instance';
import {FiPlusCircle, FiUpload} from 'react-icons/fi';
import {FaServer} from 'react-icons/fa';
import useTextInput from './hooks/useTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {addInstance, removeInstance, setInstanceIndex} from './actions/main';
import {setStatus} from './actions/tempData';
import {StatusBar} from './StatusBar';
import usePrevious from './hooks/usePrevious';
import {delay} from './utils/Utils';
import * as sailplaneUtil from './utils/sailplane-util';
import InstanceAccessDialog from './components/InstanceAccessDialog';
import {UserHeader} from './components/UserHeader';

const styles = {
  container: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFF',
    width: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Open Sans',
    boxSizing: 'border-box',
  },
  title: {
    color: primary45,
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: `1px solid ${primary2}`,
    marginBottom: 6,
  },
  icon: {
    cursor: 'pointer',
    marginRight: 4,
  },
  tools: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: primary4,
    fontSize: 12,
  },
  toolTitle: {
    marginRight: 6,
    userSelect: 'none',
  },
  instances: {},
};

export function Instances({sailplane, sharedFS}) {
  const [addInstanceMode, setAddInstanceMode] = useState(false);
  const [importInstanceMode, setImportInstanceMode] = useState(false);
  const [instanceToModifyAccess, setInstanceToModifyAccess] = useState(null);
  const dispatch = useDispatch();
  const main = useSelector((state) => state.main);
  const {instances, instanceIndex} = main;
  const prevInstanceLength = usePrevious(instances.length);

  useEffect(() => {
    if (prevInstanceLength && prevInstanceLength < instances.length) {
      dispatch(setInstanceIndex(instances.length - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instances.length, prevInstanceLength]);

  const createInstance = async () => {
    const address = await sailplaneUtil.determineAddress(sailplane);
    const driveName = sailplaneUtil.driveName(address);

    dispatch(addInstance(driveName, address.toString(), false));
    setAddInstanceMode(false);
  };

  const importInstance = async (address) => {
    const handleInvalidAddress = () => {
      dispatch(setStatus({message: 'Invalid address', isError: true}));
      delay(5500).then(() => dispatch(setStatus({})));
    };
    if (await sailplaneUtil.addressValid(sailplane, address)) {
      const driveName = sailplaneUtil.driveName(address);

      if (instances.map((s) => s.address).includes(address)) {
        dispatch(
          setStatus({
            message: `Drive [${driveName}] already exists`,
            isError: true,
          }),
        );
        delay(5500).then(() => dispatch(setStatus({})));
        return;
      }

      dispatch(addInstance(driveName, address, true));
      setImportInstanceMode(false);
    } else {
      handleInvalidAddress();
    }
  };

  const ImportInstanceInput = useTextInput(
    importInstanceMode,
    (instanceAddress) => importInstance(instanceAddress),
    () => setImportInstanceMode(false),
    '',
    {
      placeholder: 'drive address',
    },
  );

  return (
    <div style={styles.container}>
      <UserHeader sharedFS={sharedFS}/>
      <div style={styles.header}>
        <div style={styles.title}>
          <FaServer color={primary3} size={16} style={styles.icon}/>
          Drives
        </div>
        <div style={styles.tools}>
          {!importInstanceMode && !addInstanceMode ? (
            <>
              <div
                style={styles.tools}
                className={'addInstance'}
                onClick={() => setImportInstanceMode(true)}>
                <FiUpload color={primary45} size={16} style={styles.icon}/>
                <span style={styles.toolTitle}>Import drive</span>
              </div>
              <div
                style={styles.tools}
                className={'addInstance'}
                onClick={() => createInstance()}>
                <FiPlusCircle color={primary45} size={16} style={styles.icon}/>
                <span style={styles.toolTitle}>Create drive</span>
              </div>
            </>
          ) : null}

          {importInstanceMode ? ImportInstanceInput : null}
        </div>
      </div>

      <div style={styles.instances}>
        {instances.map((instance, index) => (
          <Instance
            instanceIndex={index}
            key={instance.address.toString()}
            data={instance}
            selected={instance === instances[instanceIndex]}
            onClick={() => {
              dispatch(setInstanceIndex(index));
            }}
            onDelete={() => {
              dispatch(removeInstance(index));
            }}
            onAccess={() => {
              dispatch(setInstanceIndex(index));
              setTimeout(() => setInstanceToModifyAccess(instance), 500);
            }}
          />
        ))}
      </div>
      {instanceToModifyAccess ? (
        <InstanceAccessDialog
          onClose={() => setInstanceToModifyAccess(null)}
          instanceToModifyAccess={instanceToModifyAccess}
          sharedFS={sharedFS}
        />
      ) : null}
      <StatusBar/>
    </div>
  );
}
