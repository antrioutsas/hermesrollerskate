const track = document.querySelector('.carousel-track');
const speed = 0.5; // pixels ανά καρέ – ρυθμίστε την ταχύτητα εδώ

function animateCarousel() {
    // Λήψη της τρέχουσας τιμής μετατόπισης (transform)
    const style = window.getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(style.transform);
    let translateX = matrix.m41 || 0;

    // Μετακίνηση του track προς τα αριστερά
    translateX -= speed;
    track.style.transform = `translateX(${translateX}px)`;

    // Έλεγχος αν η πρώτη εικόνα έχει εξαφανιστεί εντελώς
    const firstItem = track.firstElementChild;
    const firstRect = firstItem.getBoundingClientRect();
    const wrapperRect = track.parentElement.getBoundingClientRect();

    // Αν το δεξί άκρο της πρώτης εικόνας είναι εκτός του wrapper
    if (firstRect.right < wrapperRect.left) {
        // Αφαίρεση της πρώτης εικόνας και επαναπροσθήκη στο τέλος
        track.appendChild(firstItem);
        // Ενημέρωση της μετατόπισης ώστε να μην υπάρχει απότομη αλλαγή
        const itemStyle = window.getComputedStyle(firstItem);
        const marginRight = parseFloat(itemStyle.marginRight) || 0;
        translateX += firstRect.width + marginRight;
        track.style.transform = `translateX(${translateX}px)`;
    }
    requestAnimationFrame(animateCarousel);
}
requestAnimationFrame(animateCarousel);