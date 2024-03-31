document.addEventListener("DOMContentLoaded", function() {
    resizeRightHand(); // Call the function initially
    window.addEventListener("resize", resizeRightHand); // Recalculate on window resize

    function resizeRightHand() {
        var leftHandHeight = document.querySelector(".leftHand").offsetHeight;
        document.querySelector(".rightHand").style.height = leftHandHeight + "px";
    }
});