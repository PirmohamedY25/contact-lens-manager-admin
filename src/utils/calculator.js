// frontend/src/utils/calculator.js

function calculateContactLens(sphere, cylinder, vertexDistance) {
    console.log('Calculating contact lens:', { sphere, cylinder, vertexDistance });
    const vertexDistanceMeters = vertexDistance / 1000;
    const contactSphere = sphere / (1 - (sphere * vertexDistanceMeters));
    const contactCylinder = (sphere + cylinder) / (1 - ((sphere + cylinder) * vertexDistanceMeters)) - contactSphere;
    
    function roundDownToQuarter(value) {
        return Math.floor(value * 4) / 4;
    }

    const result = {
        exact: {
            spherical: contactSphere,
            cylinder: contactCylinder
        },
        rounded: {
            spherical: roundDownToQuarter(contactSphere),
            cylinder: roundDownToQuarter(contactCylinder)
        }
    };
    console.log('Calculation result:', result);
    return result;
}

module.exports = {
    calculateContactLens
};