export function validarFechasReserva(checkIn, checkOut) {
    if (checkOut < checkIn) {
        return false;
    }
    return true;
}