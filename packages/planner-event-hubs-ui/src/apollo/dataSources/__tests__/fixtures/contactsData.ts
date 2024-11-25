export const contactsData = {
  paging: {
    _links: {
      next: {
        href: 'https://api-platform-dev.cvent.com/ea-staging/contacts?token=75ed0aad-6db1-4031-bfc2-8c67f30cbacc'
      },
      self: {
        href: 'https://api-platform-dev.cvent.com/ea-staging/contacts?token=46e14540-a3e4-4e61-89e8-5161ac504a2f'
      }
    },
    limit: 100,
    totalCount: 2,
    nextToken: '75ed0aad-6db1-4031-bfc2-8c67f30cbacc',
    currentToken: '46e14540-a3e4-4e61-89e8-5161ac504a2f'
  },
  data: [
    {
      id: '26BD6CCA-B552-4D00-8AB7-062EE1F3B60F',
      firstName: 'Cvent',
      lastName: 'Eng',
      email: 'cventeng@j.mail',
      primaryAddressType: 'Work',
      deleted: true,
      created: '2021-12-03T18:02:25.647Z',
      lastModified: '2022-09-28T04:49:01.689Z',
      createdBy: '(Cvent - bathmanathan) ssimpson@cvent.com',
      lastModifiedBy: '(Cvent - bathmanathan) ssimpson@cvent.com',
      optOut: {
        optedOut: false,
        by: 'Cvent Support'
      }
    },
    {
      id: '7589DFD9-1F9F-4746-86F6-030CCFBAC69E',
      firstName: 'Wanda',
      lastName: 'Hilpert',
      email: 'WandaHilpert28@cvent.mail',
      company: 'Duncan, Riddle and Roth',
      title: 'International aid/development worker',
      deleted: false,
      created: '2022-05-17T03:39:39.923Z',
      lastModified: '2022-09-28T04:49:01.689Z',
      createdBy: 'Invitee Import',
      lastModifiedBy: 'Invitee Import',
      optOut: {
        optedOut: false,
        by: 'Cvent Support'
      }
    }
  ]
};
