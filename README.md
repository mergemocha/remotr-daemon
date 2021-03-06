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
| install | --host/-h, --secret/-s | Registers the daemon and installs the Windows service. |
| uninstall | (None) | Deregisters the daemon and uninstalls the Windows service. |
| reinstall | --host/-h, --secret/-s | Reinstalls and re-registers the daemon. |
| register | --host/-h, --secret/-s | Registers the daemon with the backend. |
| deregister | (None) | De-registers the daemon from the backend. |
| reregister | --host/-h, --secret/-s | Re-registers the daemon with the backend. |

(Note: All CLI arguments are mandatory unless marked as optional by surrounding with [brackets].)

## Development

### Running

The TSC watcher can be started with `npm run watch`. Live-reloading can be enabled by running `npm run dev` in a separate terminal (this project does not use ts-node).

In development (i.e. when the `NODE_ENV` environment variable is set to `development`), the daemon will run on `localhost` instead of the default internal IP. Should you wish to test this functionality, run `npm start` instead of `npm run dev`.

**Note:** In development, if not using the compiled executable, you need to use the `register` and `deregister` commands instead of `install` and `uninstall` to register/unregister the daemon. The service integration will not be available unless an executable is compiled.

### Building

To run the full build flow, including TypeScript compilation and compiling into an executable, use the `npm run build` script. To only compile TypeScript code, run `npm run tsc`, and to only build the executable, run `npm run pkg`.

Ready-made, runnable artifacts will be outputted into the `dist` folder.

(**Note:** The components in the `bin` folder are templates, _not_ the installable artifacts. The `bin` and `dist` directories are automatically merged by the `pkg` script during the build process.)
