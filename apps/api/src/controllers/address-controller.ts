import opencage from "opencage-api-client";

export async function convertCoordinatesToAddress(
  latitude: number,
  longitude: number
) {
  try {
    const data = await opencage.geocode({
      q: `${latitude}, ${longitude}`,
      language: "en",
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

export async function convertAddressToCoordinates(address: string) {
  try {
    const data = await opencage.geocode({ q: address });
    console.log(data);
    console.log(data.results[0].geometry);
  } catch (error) {
    console.error(error);
  }
}

console.log(convertCoordinatesToAddress(-7.762162, 110.3766844));
// console.log(
//   convertAddressToCoordinates(
//     "Pogung Baru Blok F 77, Sinduadi, Mlati, Sleman, DIY"
//   )
// );
