// import { logger } from "../../services/logger.js";

const form = document.getElementById('productForm');

form.addEventListener('submit', async evt => {
    evt.preventDefault();
    const data = new FormData(form);
    const response = await fetch("/api/products/",{
        method:'POST',
        body: data
    })
    const result = await response.json();
    console.log(result);
    // logger.info(result);
})