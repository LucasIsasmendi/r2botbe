/**********************************
* polling collection:
*   - title: String search title poll
*   - desc: String poll description
*   - candidates: Array list of options
*   - dates: { ini, end}
*   - totals: { voters, votes}
*   - ipfs: link
*   - bitcoin: link
{
  "title":"",
  "desc":"",
  "place":"",
  "dates": {
    ini:"",
    end:""
  },
  "candidates":[],
  "totals":{
    "voters": 0,
    "votes":0,
    "bycandidate":{
      "valids":[0,0,0,0,0,0],
      "invalids":[0,0,0,0,0,0]
    }
  },
  "ipfs":"",
  "btc":""
}
*********************************/

{
  "title":"test-1",
  "desc":"test election option 1, Necochea 28 dic, automatic wallet generator: 100 voters, 1000 hackers",
  "place":"Necochea",
  "dates": {
    ini:"Wed Dic 28 2016 09:04:22 GMT-0300 (ART)",
    end:"Wed Dic 28 2016 09:10:22 GMT-0300 (ART)"
  },
  "candidates":["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk", "Tony Stark", "Bruce Wayne"],
  "totals":{
    "voters": 100,
    "votes":1100,
    "bycandidate":{
      "valids":[0,0,0,0,0,0],
      "invalids":[0,0,0,0,0,0]
    }
  },
  "ipfs":"",
  "btc":""
}
