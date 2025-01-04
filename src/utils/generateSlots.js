// utils/generateSlots.js
export const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
    const slots = [];
    let currentTime = new Date(`2023-01-01T${startTime}:00`);
    const endTimeObj = new Date(`2023-01-01T${endTime}:00`);
  
    while (currentTime < endTimeObj) {
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
  
    return slots;
  };
  