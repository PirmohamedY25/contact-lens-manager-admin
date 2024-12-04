let contactLensData = [];

async function fetchContactLenses() {
    console.log('Fetching contact lenses from API...');
    try {
        const token = localStorage.getItem('token');
        console.log('Token check:', {
            exists: !!token,
            value: token?.substring(0, 20) + '...'
        });
        
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        contactLensData = await window.getLenses();
        console.log('Contact lenses fetched:', contactLensData);
        return contactLensData;
    } catch (error) {
        console.error('Fetch error details:', {
            message: error.message,
            type: error.constructor.name,
            stack: error.stack
        });
        
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <p>Error loading database: ${error.message}</p>
                <button onclick="location.reload()" class="retry-btn">
                    Retry
                </button>
            `;
        }
        throw error;
    }
}

function formatPower(power) {
    if (power === '' || isNaN(power)) return '';
    let formattedPower = parseFloat(power).toFixed(2);
    return (Math.abs(formattedPower) >= 10 ? '' : (formattedPower >= 0 ? '+' : '')) + formattedPower;
}

function calculateContactLens(sphere, cylinder, vertexDistance) {
    console.log('Calculating contact lens:', { sphere, cylinder, vertexDistance });
    const vertexDistanceMeters = vertexDistance / 1000;
    const contactSphere = sphere / (1 - (sphere * vertexDistanceMeters));
    const contactCylinder = (sphere + cylinder) / (1 - ((sphere + cylinder) * vertexDistanceMeters)) - contactSphere;
    
    const result = {
        exact: {
            spherical: contactSphere,
            cylinder: contactCylinder
        },
        rounded: {
            spherical: Math.round(contactSphere * 4) / 4,
            cylinder: Math.round(contactCylinder * 4) / 4
        }
    };
    console.log('Calculation result:', result);
    return result;
}
function findAvailableLenses(rightEye, leftEye, addPower) {
    console.log('Finding lenses for:', { rightEye, leftEye, addPower });
    let availableLenses = contactLensData.filter(lens => {
        const rightSphereInRange = rightEye.spherical >= lens.spherePowers.min && rightEye.spherical <= lens.spherePowers.max;
        const leftSphereInRange = leftEye.spherical >= lens.spherePowers.min && leftEye.spherical <= lens.spherePowers.max;
        const rightCylinderInRange = rightEye.cylinder <= 0 && Math.abs(rightEye.cylinder) <= Math.abs(lens.cylinderPowers.min);
        const leftCylinderInRange = leftEye.cylinder <= 0 && Math.abs(leftEye.cylinder) <= Math.abs(lens.cylinderPowers.min);
        const addInRange = !addPower || (lens.multifocal && addPower >= 0.25);
        
        return rightSphereInRange && leftSphereInRange && 
               rightCylinderInRange && leftCylinderInRange && 
               addInRange;
    });
    
    console.log('Available lenses:', availableLenses);
    return availableLenses;
}

function displayResults(right, left, rightAxis, leftAxis, addPower, dominantEye, availableLenses) {
    console.log('Displaying results:', { right, left, rightAxis, leftAxis, addPower, dominantEye });
    const calculatedResultDiv = document.getElementById('calculated-result');
    const productsFoundDiv = document.getElementById('products-found');
    const lensGridDiv = document.getElementById('lens-grid');

    calculatedResultDiv.innerHTML = `
        <h3>Calculated Result:</h3>
        <p>Right eye: ${formatPower(right.rounded.spherical)} / ${formatPower(right.rounded.cylinder)} x ${rightAxis || 'N/A'}${addPower ? ' ADD ' + formatPower(addPower) : ''}</p>
        <p>Left eye: ${formatPower(left.rounded.spherical)} / ${formatPower(left.rounded.cylinder)} x ${leftAxis || 'N/A'}${addPower ? ' ADD ' + formatPower(addPower) : ''}</p>
        ${addPower ? '<p>Dominant eye: ' + dominantEye.charAt(0).toUpperCase() + dominantEye.slice(1) + '</p>' : ''}
    `;

    productsFoundDiv.textContent = `${availableLenses.length} PRODUCTS FOUND`;

    lensGridDiv.innerHTML = '';
    if (availableLenses.length === 0) {
        lensGridDiv.innerHTML = '<p>No matching lenses found for both eyes.</p>';
    } else {
        availableLenses.forEach(lens => {
            const lensCard = document.createElement('div');
            lensCard.className = 'lens-card';
            lensCard.innerHTML = `
                <img src="placeholder-image.jpg" alt="${lens.name}">
                <h3>${lens.name}</h3>
                <p>Manufacturer: ${lens.manufacturer}</p>
                <p>Modality: ${lens.modality}</p>
                ${lens.multifocal ? '<p>Type: Multifocal</p>' : ''}
                <p>Sphere range: ${formatPower(lens.spherePowers.min)} to ${formatPower(lens.spherePowers.max)}</p>
                <p>Cylinder range: ${formatPower(lens.cylinderPowers.min)} to ${formatPower(lens.cylinderPowers.max)}</p>
            `;
            lensGridDiv.appendChild(lensCard);
        });
    }

    document.getElementById('results').classList.remove('hidden');
}

function filterByModality(modality) {
    console.log('Filtering by modality:', modality);
    const lensCards = document.querySelectorAll('.lens-card');
    let visibleCount = 0;
    lensCards.forEach(card => {
        const cardModality = card.querySelector('p:nth-child(4)').textContent.split(': ')[1].toLowerCase();
        if (modality === 'all' || cardModality === modality) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    document.getElementById('products-found').textContent = `${visibleCount} PRODUCTS FOUND`;
}
function init() {
    console.log('Initializing calculator');
    const calculateBtn = document.getElementById('calculate-btn');
    const rightAddInput = document.getElementById('right-add');
    const leftAddInput = document.getElementById('left-add');
    const vertexDistanceInput = document.getElementById('vertex-distance');
    const rightAxisInput = document.getElementById('right-axis');
    const leftAxisInput = document.getElementById('left-axis');

    function validateAxis(input) {
        let value = parseInt(input.value) || 0;
        if (value < 0) value = 0;
        if (value > 180) value = 180;
        input.value = value;
    }

    rightAxisInput.addEventListener('input', function() {
        validateAxis(this);
    });

    leftAxisInput.addEventListener('input', function() {
        validateAxis(this);
    });

    calculateBtn.addEventListener('click', async function() {
        console.log('Calculate button clicked');
        const rightSphere = parseFloat(document.getElementById('right-sphere').value) || 0;
        const rightCylinder = parseFloat(document.getElementById('right-cylinder').value) || 0;
        const rightAxis = Math.round(parseFloat(rightAxisInput.value)) || 0;
        const leftSphere = parseFloat(document.getElementById('left-sphere').value) || 0;
        const leftCylinder = parseFloat(document.getElementById('left-cylinder').value) || 0;
        const leftAxis = Math.round(parseFloat(leftAxisInput.value)) || 0;
        const vertexDistance = parseFloat(vertexDistanceInput.value) || 12;
        const addPower = parseFloat(rightAddInput.value) || parseFloat(leftAddInput.value) || 0;
        const dominantEye = document.getElementById('dominant-eye').value;

        console.log('Input values:', { rightSphere, rightCylinder, rightAxis, leftSphere, leftCylinder, leftAxis, vertexDistance, addPower, dominantEye });

        const rightResult = calculateContactLens(rightSphere, rightCylinder, vertexDistance);
        const leftResult = calculateContactLens(leftSphere, leftCylinder, vertexDistance);

        const availableLenses = findAvailableLenses(
            { spherical: rightResult.rounded.spherical, cylinder: rightResult.rounded.cylinder },
            { spherical: leftResult.rounded.spherical, cylinder: leftResult.rounded.cylinder },
            addPower
        );

        displayResults(rightResult, leftResult, rightAxis, leftAxis, addPower, dominantEye, availableLenses);
    });

    const modalityButtons = document.querySelectorAll('.modality-btn');
    modalityButtons.forEach(button => {
        button.addEventListener('click', function() {
            modalityButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterByModality(this.dataset.modality);
        });
    });

    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value !== '') {
                if (this.id.includes('add')) {
                    this.value = formatPower(Math.abs(parseFloat(this.value)));
                } else if (!this.id.includes('axis') && !this.id.includes('vertex-distance')) {
                    this.value = formatPower(this.value);
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    const loadingElement = document.getElementById('loading');
    const calculatorElement = document.getElementById('calculator');

    try {
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        await fetchContactLenses();
        console.log('Database loaded, initializing app...');
        if (loadingElement) loadingElement.classList.add('hidden');
        if (calculatorElement) calculatorElement.classList.remove('hidden');
        init();
    } catch (error) {
        console.error('Failed to fetch contact lenses from API:', error);
        // Error handling is done in fetchContactLenses()
    }
});