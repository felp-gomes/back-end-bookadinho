const notifications = [
  {
    id: "0001",
    sender: {
      id: "0001",
      name: "felipeo.goms",
    },
    recipient: {
      id: "0004",
      name: "paulacynthia",
    },
    type: "follow",
    time: "2022-11-08T08:02:17-05:00",
  },
  {
    id: "0002",
    sender: {
      id: "0004",
      name: "paulacynthia",
    },
    recipient: {
      id: "0001",
      name: "felipeo.goms",
    },
    type: "follow",
    time: "2022-11-08T09:04:31-05:00",
  },
  {
    id: "0003",
    sender: {
      id: "0003",
      name: "case",
    },
    recipient: {
      id: "0001",
      name: "felipeo.goms",
    },
    type: "follow",
    time: "2022-11-01T08:04:50-05:00",
  },
  {
    id: "0004",
    sender: {
      id: "0003",
      name: "case",
    },
    recipient: {
      id: "0001",
      name: "felipeo.goms",
    },
    type: "message",
    time: "2022-11-01T08:04:50-05:00",
  },
  {
    id: "0005",
    sender: {
      id: "0004",
      name: "paulacynthia",
    },
    recipient: {
      id: "0002",
      name: "guaranolas",
    },
    type: "follow",
    time: "2022-11-01T17:01:15-05:00",
  },
];

module.exports = {
  notifications,
};
