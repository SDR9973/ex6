const url = 'https://ex6.onrender.com';
const formBtns = document.querySelectorAll('.form-icons');
const errCon = document.querySelector('#error');
const name = document.getElementById('name');
const locationInp = document.getElementById('location');
const price = document.getElementById('price');
const imageUrl = document.getElementById('imageUrl');
const searchBtn = document.querySelector('#search-icon-btn');
const formContainer = document.querySelector('.form-container');
const addVacationDiv = document.querySelector('.add-vacation');


window.onload = async () => {
    try {
        addVacationDiv.classList.add('formBgImage');
        displayOnlyAddBtn()
        await fetchVacations(); 
    } catch (error) {
        console.error('Error on load:', error);
    }
};

function displayOnlyAddBtn() {
    formBtns.forEach(function (el) {
        if (el.id !== "add-button") el.classList.add('hide');
    })

}



const fetchVacations = async () => {
    try {
        const response = await fetch(`${url}/api/vacations/fetchVacations`);  
        const vacations = await response.json();
        displayVacations(vacations);
    } catch (error) {
        console.error('Error fetching vacations:', error);
    }
};

const searchVacations = async (query) => {
    try {
        if (query.length < 3) {
            alert("You must type at least 3 characters!")
        }
        const response = await fetch(`${ url }/api/vacations/search?query=${ encodeURIComponent(query) }`);
        const vacations = await response.json();
        displayVacations(vacations);
    } catch (error) {
        console.error('Error searching vacations:', error);
    }
};

const displayVacations = (vacations) => {

    const vacationGrid = document.getElementById('vacationgrid');
    vacationGrid.innerHTML = '';

    vacations.forEach(vacation => {
        const vacationCard = document.createElement('div');
        vacationCard.classList.add('vacation-card');
        vacationCard.id = vacation.id;
        vacationCard.innerHTML = `
            <img src="${vacation.image_url || '/api/placeholder/250/150'}" alt="${vacation.name}" class="vacation-image">
            <div class="container-vacation">
                <div class="action-buttons">
                    <div id="edit-icon-btn" onclick="putValueWhenEditAction(${vacation.id})"></div>
                    <div id="delete-icon-btn" onclick="deleteVacation(${vacation.id})"></div>

                </div>
            <div class="vacation-info">
                <div class="vacation-title">${vacation.name}</div>
            
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div class="location-container">
                <div class="icon-location"></div>
                <div class="vacation-location">${vacation.location}</div>
            </div>    
            <div class="vacation-price">$${Number(vacation.price).toFixed(2)}</div>
            </div>
            </div>
        `;

        vacationGrid.appendChild(vacationCard);
    });
};

const deleteVacation = async (id) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        const confirmed = confirm('Are you sure you want to delete this vacation?');
        if (!confirmed) return;

        const response = await fetch(`${url}/api/vacations/delete/${id}`, {
            method: 'DELETE',
        });

    if (!response.ok) {
        throw new Error('Failed to delete vacation');
    }

    const result = await response.json();


    await fetchVacations();
} catch (error) {
    console.error('Error deleting vacation:', error);
}
};

const borderDivInEditAction = (id) => {
    document.querySelectorAll('.vacation-card').forEach(el => {
        if (el.id == id) el.classList.add('border-card');
        console.log(el.id, id);
    })
};
const cancelBorderDiv = () => {
    document.querySelectorAll('.vacation-card').forEach(el => {
        el.classList.remove('border-card');
    })
};


const putValueWhenEditAction = async (id) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        document.getElementById('formHeader').innerHTML = 'Edit a vacation';
        addVacationDiv.classList.remove('formBgImage');
        formBtns.forEach(function (el) {
            el.classList.remove('hide')
            if (el.id === "add-button") el.classList.add('hide')
        });
        borderDivInEditAction(id);
        const response = await fetch(`${url}/api/vacations/vacation/${ id }`);
        if (!response.ok) {
            throw new Error('Failed to fetch vacation details');
        }

        const vacation = await response.json();

        document.getElementById('vacationId').value = vacation.id;
        name.value = vacation.name;
        locationInp.value = vacation.location;
        price.value = vacation.price;
        imageUrl.value = vacation.image_url;

    } catch (error) {
        console.error('Error fetching vacation details:', error);
    }
};


const updateVacation = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        addVacationDiv.classList.add('formBgImage');
        const id = document.getElementById('vacationId').value;
        const nameVal = name.value;
        const priceVal = Number(price.value);
        const locationVal = locationInp.value;
        const imageUrlVal = imageUrl.value || '/api/placeholder/250/150';
        validateVacation(nameVal, priceVal, locationVal, imageUrlVal)

        const vacation = {
            name: nameVal,
            price: priceVal,
            location: locationVal,
            imageUrl: imageUrlVal,
        };
        const response = await fetch(`${url}/api/vacations/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vacation)
        });

        cancelBorderDiv()
    } catch (error) {
        console.error('Error updating vacation:', error);
        errCon.classList.remove('hide');
        errCon.style.backgroundColor = 'red';
        errCon.innerHTML = error;
    }
}

const goBack = (event) => {
    document.getElementById('formHeader').innerHTML = "Add a new vacation"
    event.preventDefault();
    event.stopPropagation();
    addVacationDiv.classList.add('formBgImage');
    formBtns.forEach(function (el) {
        el.classList.remove('hide');
        if (el.id !== "add-button") el.classList.add('hide');
    })
    resetForm();
    errCon.classList.add('hide');
    cancelBorderDiv()
}

const submitVacation = async (event) => {
    document.getElementById('formHeader').innerHTML = "Add a new vacation"
    event.preventDefault();
    event.stopPropagation();
    try {
        const nameVal = name.value;
        const priceVal = price.value;
        const locationVal = locationInp.value;
        const imageUrlVal = imageUrl.value || '/api/placeholder/250/150';

        validateVacation(nameVal, priceVal, locationVal, imageUrlVal)

        const vacation = {
            name: nameVal,
            price: Number(priceVal),
            location: locationVal,
            imageUrl: imageUrlVal,
        };
        const response = await fetch(`${url}/api/vacations/create`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vacation)
        });


    } catch (error) {
        console.error('Error submitting vacation:', error);
        errCon.classList.remove('hide');
        errCon.innerHTML = error;
        errCon.style.backgroundColor = 'red';
    }
};

const resetForm = () => {
    document.getElementById('newVacationForm').reset();
    document.getElementById('vacationId').value = '';
};

const validateVacation = (nameVal, priceVal, locationVal, imageUrlVal) => {
    if (!nameVal || !locationVal || !price || !imageUrl) throw new Error("please fill all required fields");
    let isContainsNumbers = nameVal.split('').some(char => !isNaN(char));
    if (isContainsNumbers) throw new Error("Name cannot contain numbers");
    isContainsNumbers = locationVal.split('').some(char => !isNaN(char));
    if (isContainsNumbers) throw new Error("Location cannot contain numbers");
    let subOfImgUrl = imageUrlVal.substr(0, 4);
    if (subOfImgUrl !== "http") throw new Error("please enter a valid url");
    let isContainsChar = priceVal.split('').some(char => isNaN(char));
    if (isContainsChar) throw new Error("Price can contain only numbers");
    if (!priceVal) throw new Error("price must be more than zero");
};


formBtns.forEach(function (el) {
    if (el.id === "add-button") el.addEventListener("click", submitVacation);
    if (el.id === "save-button") el.addEventListener("click", updateVacation);
    if (el.id === "goBack-button") el.addEventListener("click", goBack);
});

formContainer.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
});

searchBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const query = document.querySelector('.search-input').value;
    if (query) {
        await searchVacations(query);
    }
});

document.addEventListener('click', () => {
    errCon.classList.add('hide');
});