import { Polybase } from "@polybase/client";

// DB name
const nameSpace = "okozukai-db"

const db = new Polybase({
  defaultNamespace: nameSpace,
});

// scheme
await db.applySchema(`
  @public
  collection OkozukaiDB2 {
    id: string;
    sender: string;
    type: string;
    tokenAddr: string;
    to: string;
    amount: string;
    factory: string;
    status: string;
    date: string;

    @index(id, [date, desc]);

    constructor (
      id: string,
      sender: string,
      type: string,
      tokenAddr: string,
      to: string,
      amount: string,
      factory: string,
      status: string,
      date: string
    ) {
      this.id = id;
      this.sender = sender;
      this.type = type;
      this.tokenAddr = tokenAddr;
      this.to = to;
      this.amount = amount;
      this.factory = factory;
      this.status = status;
      this.date = date;
    }
  }
`,
  `${nameSpace}`
); 

// your-namespace is optional if you have defined a default namespace

// insert (sample)
// await db.collection("City").create(["new-york", "New York"]); 

// read
const data = await db.collection("OkozukaiDB2").get();

console.log(`read data: ${JSON.stringify(data.toJSON())}`)