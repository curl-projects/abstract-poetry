/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
  serverDependenciesToBundle: [/^d3*/,
                               "d3-selection",
                               "d3-array",
                               "d3-force-d3",
                               "d3-scale",
                               "d3-scale-chromatic",
                               "force-graph",
                               "internmap",
                               /^d3.*/,
                               "react-force-graph-2d"]
};
