export const getAvailableBedQuery = `
    SELECT r.room_id,
           b.bed_id
    FROM room r
             JOIN bed b ON b.room_id = r.room_id
    WHERE r.ward_id = $1
      AND r.occupancy < r.capacity
      AND b.is_occupied = FALSE
    ORDER BY r.room_id,
             b.bed_id
    LIMIT 1;
`;

export const updateBedIsOccupiedQuery = `
    UPDATE bed
    SET is_occupied = TRUE
    WHERE bed_id = $1
`;

export const updateRoomOccupancyQuery = `
    UPDATE room
    SET occupancy = occupancy + 1
    WHERE room_id = $1
`;
export const updateWardOccupancyQuery = `
    UPDATE ward
    SET occupancy = occupancy + 1
    WHERE ward_id = $1
`;

export const insertNewPatientQuery = `
    INSERT INTO patient (ward_id, room_id, bed_id)
    VALUES ($1, $2, $3)
    RETURNING patient_id
`;
