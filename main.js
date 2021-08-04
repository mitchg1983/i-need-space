//Declare dom elements via jquery
const searchSat = $("#search");

//readies the time to be displayed to the user
function displayTime(i) {
  return i.toString().substring(0, 19);
}

//populates the output box with the satellite data
//input is either an error message, or the sat data
//input must be a string, and CAN be html code
function addText(input) {
  $("div.user-output").addClass("on");
  setTimeout(function () {
    delay(input);
  }, 1500);
  return;
}

//this assists the transition function in the css. until this function is called,
//the output text will not exist in the DOM.
function delay(input) {
  const outputTextField = $("div.output-text-field");
  $(outputTextField).html(input).addClass("on-text");
  return;
}



//Will use the three text fields as inputs, to return the desired sattelite info
//when the 'search' button is clicked
$(searchSat).on("click", function () {
  //These are declared inside the scope of the function, so the user can re-enter
  //coords without reloading the page.
  $("div.user-output").removeClass("on");
  $("div.output-text-field").removeClass("on-text");


  let apiKey = $("#api-key").val();
  let address = $("#address").val();
  let norad = $("#norad").val();




  //If any of the fields are empty, display an error message
  if (apiKey === "" || address === "" || norad === "") {
    addText("Invalid Entry");
    return;
  } else {
    //encode the geographic address string, as a URI
    const addressURI = encodeURI(address);

    const search = async () => {
      //Use the address input, after encoding for URI, to fetch the lat & log coordinates from mapbox
      const rawData = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressURI}.json?access_token=${apiKey}`
      );

      const coords = await rawData.json();

      console.log(typeof coords);

      //Inside the return from mapbox, are the desired coords
      const longitude = coords.features[0].center[0];
      const latitude = coords.features[0].center[1];

      console.log(
        "Address converted to coordinates: ",
        latitude,
        "by",
        longitude
      );

      //Use the coords from mapbox, and the NORAD sat identifier, to fetch our satellite data
      const rawSatData = await fetch(
        `https://satellites.fly.dev/passes/${norad}?lat=-${latitude}&lon=${longitude}&limit=1&days=15&visible_only=true`
      );

      const flyover = await rawSatData.json();

      //Store the sat flyover data
      const rise = flyover[0].rise.utc_datetime;
      const culminate = flyover[0].culmination.utc_datetime;
      const set = flyover[0].set.utc_datetime;

      console.log("Your rise time is,", displayTime(rise));
      console.log("Your culminate time is,", displayTime(culminate));
      console.log("Your set time is,", displayTime(set));

      const riseTime = displayTime(rise);
      const culminateTime = displayTime(culminate);
      const setTime = displayTime(set);

      const outputText =
        "Your rise time is " +
        riseTime +
        "<br />" +
        "Your culminate time is " +
        culminateTime +
        "<br />" +
        "Your set time is " +
        setTime;

      addText(outputText);
    };
    search();
  }return
});
