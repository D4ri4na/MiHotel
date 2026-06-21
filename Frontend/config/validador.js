export function validarFechasReserva(checkInDateString, checkOutDateString) {
    const checkIn = new Date(checkInDateString);
    const checkOut = new Date(checkOutDateString);
    
    if (isNaN(checkIn) || isNaN(checkOut)) return false;
    
    return checkOut > checkIn;
}