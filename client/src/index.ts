
import { exponent, UI } from "@roguecircuitry/htmless";

async function main () {
  let ui = new UI.Builder()
  .default(exponent)

  .create("style")
  .style({
    "#header": {
      maxHeight: "1em",
      backgroundColor: "gray"
    }
  })
  .mount(document.head)

  .create("div", "header")
  .mount(document.body)


}

main();
