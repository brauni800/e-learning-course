'use strict';

const { UserRole, Role } = require('../models')

module.exports = (req, res, next) => {
  Role.findByRole('professor')
      .then((role) => {
        const { userId } = req.dto;
        return UserRole.getUserRole(userId)
            .then((record) => ({ userRoles: record, role }));
      })
      .then(({ userRoles, role }) => userRoles.find((ur) => ur.role_id === role.role_id))
      .then((record) => {
        if (record) next();
        else throw new Error('You don\'t have the necessary permissions for this resource');
      })
      .catch((err) => res.status(400).json({ message: err.message }));
};
