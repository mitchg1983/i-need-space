//Declare dom elements via jquery
const searchSat = $("#search");

function displayTime(i) {
  return i.toString().substring(0, 19);
}

//Will use the three text fields as inputs, to return the desired sattelite info
//when the 'search' button is clicked
$(searchSat).on("click", function () {
  //These are declared inside the scope of the function, so the user can re-enter
  //coords without reloading the page.
  const apiKey = $("#api-key").val();
  const address = $("#address").val();
  const addressURI = encodeURI(address);
  const norad = $("#norad").val();

  //Using the async function
  const search = async () => {
    //Use the address input, after encoding for URI, to fetch the lat & log coordinates from mapbox
    const rawData = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressURI}.json?access_token=${apiKey}`
    );

    const coords = await rawData.json();

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

    console.log(flyover);

    //Store the sat flyover data
    const rise = flyover[0].rise.utc_datetime;
    const culminate = flyover[0].culmination.utc_datetime;
    const set = flyover[0].set.utc_datetime;

    // console.log(
    //   "Satellite", norad, "will rise at -", rise,
    //   "\n",
    //   "Satellite", norad,
    //   "will culminate at -", culminate,
    //   "\n",
    //   "Satellite",  norad,  "will set at -", set,
    //   "\n"
    // );

    console.log("Your rise time is,", displayTime(rise));
    console.log("Your culminate time is,", displayTime(culminate));
    console.log("Your set time is,", displayTime(set));

    const riseTime = displayTime(rise);
    const culminateTime = displayTime(culminate);
    const setTime = displayTime(set);

    $("div.user-output").addClass("on");

    const outputBox = $("div.on");

    const outputText =
      "Your rise time is " +
      riseTime +
      "<br />" +
      "Your culminate time is " +
      culminateTime +
      "<br />" +
      "Your set time is " +
      setTime;

    $(outputBox).html(outputText);
      
  };

  search();
});
