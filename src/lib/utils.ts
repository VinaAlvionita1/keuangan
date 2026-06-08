export function getRomanNumeral(month: number): string {
    const romanNumerals = [
        "I", "II", "III", "IV", "V", "VI",
        "VII", "VIII", "IX", "X", "XI", "XII"
    ];
    return romanNumerals[month - 1] || "";
}
