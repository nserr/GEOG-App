const config = require("./package.json");

const { title, description, author, repository, homepage } = config;

const siteMetadata = {
  companyName: 'CSC 497 Project',
  companyUrl: 'https://github.com/nserr',
  authorName: 'Noah Serr',
  authorUrl: author.url,
  siteUrl: homepage,
  siteDescription: description,
};

module.exports = {
  siteMetadata,
  plugins: [
    "gatsby-plugin-resolve-src",
    {
      resolve: "gatsby-plugin-sass",
      options: {
        implementation: require("sass"),
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    "gatsby-plugin-react-leaflet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: siteMetadata.companyName,
        short_name: siteMetadata.companyName,
        start_url: "/",
        icon: "src/assets/images/transparent-house-icon.jpg",
      },
    },
  ],
};
