// Cross-platform copying for template binaries from /bin into /dist

const path = require('path')
const fs = require('fs-extra')

// Copy source files from bin into dist
fs.copy(path.join(process.cwd(), 'bin'), path.join(process.cwd(), 'dist'))
