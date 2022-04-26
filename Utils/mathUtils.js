function between_positive_or_negative(number, low, high) {
    if(number >= low && number <= high) {
        return true;
    }
    if(number >= -high && number <= -low) {
        return true;
    }

    return false;
}