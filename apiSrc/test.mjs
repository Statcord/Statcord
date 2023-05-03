const apiResult = {
  "mainStats": [
    {
      "time": "2023-05-02T22:29:16.903832893Z",
      "cpuUsage": 0,
      "guildCount": 0,
      "members": 0,
      "ramUsage": 0,
      "shardCount": 0,
      "totalRam": 0,
      "userCount": 0
    },
    {
      "time": "2023-05-02T22:29:30.253554336Z",
      "cpuUsage": 11,
      "guildCount": 62,
      "members": 9,
      "ramUsage": 88,
      "shardCount": 61,
      "totalRam": 50,
      "userCount": 14
    },
    {
      "time": "2023-05-02T22:29:36.996052301Z",
      "cpuUsage": 6,
      "guildCount": 82,
      "members": 38,
      "ramUsage": 73,
      "shardCount": 49,
      "totalRam": 48,
      "userCount": 46
    },
    {
      "time": "2023-05-02T22:29:48.478915974Z",
      "cpuUsage": 0,
      "guildCount": 0,
      "members": 0,
      "ramUsage": 0,
      "shardCount": 0,
      "totalRam": 0,
      "userCount": 0
    },
    {
      "time": "2023-05-02T23:09:03.709859075Z",
      "cpuUsage": 0,
      "guildCount": 0,
      "members": 0,
      "ramUsage": 0,
      "shardCount": 0,
      "totalRam": 0,
      "userCount": 0
    },
    {
      "time": "2023-05-02T23:28:07.924171787Z",
      "cpuUsage": 0,
      "guildCount": 0,
      "members": 0,
      "ramUsage": 0,
      "shardCount": 0,
      "totalRam": 0,
      "userCount": 0
    },
    {
      "time": "2023-05-02T23:39:30.192944348Z",
      "cpuUsage": 0,
      "guildCount": 0,
      "members": 0,
      "ramUsage": 0,
      "shardCount": 0,
      "totalRam": 0,
      "userCount": 0
    },
    {
      "time": "2023-05-02T23:39:31.54487195Z",
      "cpuUsage": 0,
      "guildCount": 0,
      "members": 0,
      "ramUsage": 0,
      "shardCount": 0,
      "totalRam": 0,
      "userCount": 0
    },
    {
      "time": "2023-05-02T23:39:33.536219275Z",
      "cpuUsage": 0,
      "guildCount": 0,
      "members": 0,
      "ramUsage": 0,
      "shardCount": 0,
      "totalRam": 0,
      "userCount": 0
    }
  ],
  "commands": [
    {
      "time": "2023-05-02T23:09:03.709859075Z",
      "sadf": 3,
      "sadf3512": 30
    },
    {
      "time": "2023-05-02T23:28:07.924171787Z",
      "sadf": 3,
      "sadf3512": 30
    },
    {
      "time": "2023-05-02T23:39:30.192944348Z",
      "sadf": 3,
      "sadf3512": 30
    },
    {
      "time": "2023-05-02T23:39:31.54487195Z",
      "sadf": 3,
      "sadf3512": 30
    },
    {
      "time": "2023-05-02T23:39:33.536219275Z",
      "sadf": 3,
      "sadf3512": 30
    }
  ]
}

const holder = {};
apiResult.commands.map((d)=> {
  Object.keys(d).map(key=>{
    if (key === "time") return;
    if (holder[key]) holder[key]+= d[key]
    else holder[key] = d[key]
  })
});

const keys = Object.keys(holder)
const values = Object.values(holder)

console.log(keys);
console.log(values)