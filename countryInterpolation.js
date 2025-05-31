/**
 * Performs bilinear interpolation on a given 2D data table using predefined global constant data.
 *
 * @param {number} effectiveHeightZ The effective height z-coordinate for interpolation.
 * @param {number} closestDistanceToSea The closest distance to sea y-coordinate for interpolation.
 * @returns {number} The interpolated value.
 * @throws {Error} If input coordinates are outside the table's defined range.
 */
function interpolateValues(effectiveHeightZ, closestDistanceToSea) {
    // These constants are now accessed directly from the global scope
    const height_coords = window.effective_height_z_coords;
    const distance_coords = window.closest_distance_to_sea_coords;
    const data = window.table_data;

    // Check if inputs are within the table's range
    // Allow for slight floating point inaccuracies for boundary checks
    const EPSILON = 1e-9;
    if (effectiveHeightZ < height_coords[0] - EPSILON || effectiveHeightZ > height_coords[height_coords.length - 1] + EPSILON ||
        closestDistanceToSea < distance_coords[0] - EPSILON || closestDistanceToSea > distance_coords[distance_coords.length - 1] + EPSILON) {
        throw new Error(`Input coordinates (Height: ${effectiveHeightZ}, Distance: ${closestDistanceToSea}) are outside the defined table range.`);
    }

    // Find the bounding box for effectiveHeightZ
    let h1_idx = -1;
    let h2_idx = -1;
    for (let i = 0; i < height_coords.length; i++) {
        if (height_coords[i] <= effectiveHeightZ + EPSILON) {
            h1_idx = i;
        }
        if (height_coords[i] >= effectiveHeightZ - EPSILON) {
            h2_idx = i;
            break;
        }
    }

    // Adjust indices for exact matches or boundaries if needed
    if (h1_idx === -1) h1_idx = 0;
    if (h2_idx === -1) h2_idx = height_coords.length - 1;
    if (h1_idx === h2_idx && h1_idx < height_coords.length - 1 && effectiveHeightZ > height_coords[h1_idx]) {
        h2_idx++;
    } else if (h1_idx === h2_idx && h1_idx > 0 && effectiveHeightZ < height_coords[h1_idx]) {
        h1_idx--;
    }


    // Find the bounding box for closestDistanceToSea
    let d1_idx = -1;
    let d2_idx = -1;
    for (let i = 0; i < distance_coords.length; i++) {
        if (distance_coords[i] <= closestDistanceToSea + EPSILON) {
            d1_idx = i;
        }
        if (distance_coords[i] >= closestDistanceToSea - EPSILON) {
            d2_idx = i;
            break;
        }
    }

    // Adjust indices for exact matches or boundaries if needed
    if (d1_idx === -1) d1_idx = 0;
    if (d2_idx === -1) d2_idx = distance_coords.length - 1;
    if (d1_idx === d2_idx && d1_idx < distance_coords.length - 1 && closestDistanceToSea > distance_coords[d1_idx]) {
        d2_idx++;
    } else if (d1_idx === d2_idx && d1_idx > 0 && closestDistanceToSea < distance_coords[d1_idx]) {
        d1_idx--;
    }


    const h1 = height_coords[h1_idx];
    const h2 = height_coords[h2_idx];
    const d1 = distance_coords[d1_idx];
    const d2 = distance_coords[d2_idx];

    const q11 = data[h1_idx][d1_idx];
    const q12 = data[h1_idx][d2_idx];
    const q21 = data[h2_idx][d1_idx];
    const q22 = data[h2_idx][d2_idx];

    // If exact match on one or both axes, simplify
    if (Math.abs(effectiveHeightZ - h1) < EPSILON && Math.abs(closestDistanceToSea - d1) < EPSILON) return q11;
    if (Math.abs(effectiveHeightZ - h1) < EPSILON) { // Exact height, linear interpolate on distance
        if (Math.abs(d2 - d1) < EPSILON) return q11; // Avoid division by zero if d1 == d2
        return q11 * (d2 - closestDistanceToSea) / (d2 - d1) + q12 * (closestDistanceToSea - d1) / (d2 - d1);
    }
    if (Math.abs(closestDistanceToSea - d1) < EPSILON) { // Exact distance, linear interpolate on height
        if (Math.abs(h2 - h1) < EPSILON) return q11; // Avoid division by zero if h1 == h2
        return q11 * (h2 - effectiveHeightZ) / (h2 - h1) + q21 * (effectiveHeightZ - h1) / (h2 - h1);
    }

    // Full bilinear interpolation
    const R1 = (q11 * (h2 - effectiveHeightZ) + q21 * (effectiveHeightZ - h1)) / (h2 - h1);
    const R2 = (q12 * (h2 - effectiveHeightZ) + q22 * (effectiveHeightZ - h1)) / (h2 - h1);

    return (R1 * (d2 - closestDistanceToSea) + R2 * (closestDistanceToSea - d1)) / (d2 - d1);
}

// --- Define your coordinates based on the table headers ---
// Make sure these are also global (e.g., in coords.js or defined before this function)
window.effective_height_z_coords = [2, 5, 10, 15, 20, 30, 40, 50]; // Numerical representation of <=2, 5, 10, etc.
window.closest_distance_to_sea_coords = [0.1, 2, 10, 100]; // Numerical representation of <0.1, 2, 10, >=100

// --- Your complete table data ---
window.table_data = [
    // Effective Height z <=2 (row 0)
    [1.9, 1.6, 1.5, 1.4],
    // Effective Height z 5 (row 1)
    [2.43, 2.18, 2.05,1.9],
    // Effective Height z 10 (row 2)
    [2.82,2.65,2.5,2.32],
    // Effective Height z 15 (row 3)
    [3.07,3.02,2.85,2.67],
    // Effective Height z 20 (row 4)
    [3.2,3.15,2.98,2.78],
    // Effective Height z 30 (row 5)
    [3.42,3.43,3.27,3.04],
    // Effective Height z 40 (row 6)
    [3.55,3.56,3.45,3.22],
    // Effective Height z 50 (row 7)
    [3.68,3.68,3.62,3.39]
];

// --- Example Usage (assuming this code is in interpolationUtils.js or loaded before script.js) ---
// Now you can call it like this:
// const result = interpolateValues(h_val, distance_from_sea_val);