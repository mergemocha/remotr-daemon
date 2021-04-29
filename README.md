# remotr-daemon

Daemon software for Remotr.

## CLI

The Remotr daemon can be configured via a simple CLI.

Usage:

```bash
# Install
remotr-daemon.exe install --host http://yourbackendhost:3000 --secret yourServerSecret
# Or with shorter syntax
remotr-daemon.exe install -h http://yourbackendhost:3000 -s yourServerSecret

# Uninstall
remotr-daemon.exe uninstall
```

Available commands:

| Command | Arguments | Description |
| ------- | --------- | ----------- |
| install | --host/-s, --secret/-s | Registers the daemon and installs the Windows service. |
| uninstall | (None) | Deregisters the daemon and uninstalls the Windows service. |
| reinstall | --host/-s, --secret/-s | Reinstalls and re-registers the daemon. |
| register | --host/-s, --secret/-s | Registers the daemon with the backend. |
| deregister | (None) | De-registers the daemon from the backend. |
| reregister | --host/-s, --secret/-s | Re-registers the daemon with the backend. |

(Note: All CLI arguments are mandatory unless marked as optional by surrounding with [brackets].)
