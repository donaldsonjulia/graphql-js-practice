const HEADER_REGEX = /bearer token-(.*)$/;

/** extremely simple token for example purposes only */

module.exports.authenticate = async ({headers: {authorization}}, Users) => {
  const email = authorization && HEADER_REGEX.exec(authorization)[1];
  return email && await Users.findOne({email});
};
