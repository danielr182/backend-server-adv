const { roles } = require('../constants/roles');

const getMenuFront = (role = roles.user) => {
  const menu = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        {
          title: 'Dashboard',
          url: '/dashboard',
        },
        {
          title: 'ProgressBar',
          url: '/progress',
        },
      ],
    },
  ];

  if (role === roles.admin) {
    menu.push({
      title: 'Maintenance',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        {
          title: 'Users',
          url: '/users',
        },
        {
          title: 'Hospitals',
          url: '/hospitals',
        },
        {
          title: 'Medics',
          url: '/medics',
        },
      ],
    });
  }

  return menu;
};

module.exports = { getMenuFront };
