import Wkt from "wicket";

export const parsePath = (pathWKT) => {
    try {
        const wicket = new Wkt.Wkt();
        wicket.read(pathWKT);
        return wicket.toJson().coordinates.map(([lng, lat]) => [lat, lng]);
    } catch (error) {
        console.error("Error parsing path:", error);
        return [];
    }
};
  
export const formatTime = (isoString) => {
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2, "0")}.${String(
        date.getMinutes()
    ).padStart(2, "0")}`;
};
  