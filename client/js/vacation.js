const url = 'http://localhost:5001';
let isEditing = false;  

window.onload = async () => {
    try {
        eventListeners();
        await fetchVacations();  
    } catch (error) {
        console.error('Error on load:', error);
    }
};

const eventListeners = () => {
    document.getElementById('newVacationForm').addEventListener('submit', async (event) => {
        event.preventDefault();  
        if (isEditing) {
            await updateVacation(event);  
        } else {
            await submitVacation(event);  
        }
        await fetchVacations();  
        resetForm(); 
    });

    document.querySelector('#search-icon-btn').addEventListener('click', async () => {
        const query = document.querySelector('.search-input').value;
        if (query) {
            await searchVacations(query);  
        }
    });
};

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
        if(query.length < 3) {
            alert("You must type at least 3 characters!")
        }
        const response = await fetch(`${url}/api/vacations/search?query=${encodeURIComponent(query)}`);  
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

        vacationCard.innerHTML = `
            <img src="${vacation.image_url || '/api/placeholder/250/150'}" alt="${vacation.name}" class="vacation-image">
            <div class="container-vacation">
                <div class="action-buttons">
                    <button class="action-button" onclick="editVacation(${vacation.id})">✏️</button>
                    <button class="action-button" onclick="deleteVacation(${vacation.id})">🗑️</button>
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

const editVacation = async (id) => {
    try {
        const response = await fetch(`${url}/api/vacations/vacation/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch vacation details');  
        }
        const vacation = await response.json();  

        document.getElementById('vacationId').value = vacation.id;
        document.getElementById('name').value = vacation.name;
        document.getElementById('location').value = vacation.location;
        document.getElementById('price').value = vacation.price;
        document.getElementById('imageUrl').value = vacation.image_url;

        isEditing = true; 
        document.querySelector('.add-button').textContent = 'Update';  
    } catch (error) {
        console.error('Error fetching vacation details:', error);
    }
};

const updateVacation = async (event) => {
    const formData = new FormData(event.target);
    const id = formData.get('vacationId');  
    const name = formData.get('name');
    const price = Number(formData.get('price'));
    const location = formData.get('location');
    const imageUrl = formData.get('imageUrl') || '/api/placeholder/250/150';  

    const vacation = {
        name: name,
        price: price,
        location: location,
        imageUrl: imageUrl,
    };

    try {
        const response = await fetch(`${url}/api/vacations/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vacation)
        });

        const data = await response.json();
  
    } catch (error) {
        console.error('Error updating vacation:', error);
    }

    isEditing = false;  
    document.querySelector('.add-button').textContent = '+';  
};

const submitVacation = async (event) => {
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const price = Number(formData.get('price'));
    const location = formData.get('location');
    const imageUrl = formData.get('imageUrl') || '/api/placeholder/250/150'; 

    const vacation = {
        name: name,
        price: price,
        location: location,
        imageUrl: imageUrl,
    };

    try {
        const response = await fetch(`${url}/api/vacations/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vacation)
        });

        const data = await response.json();

    } catch (error) {
        console.error('Error submitting vacation:', error);
    }
};

const resetForm = () => {
    document.getElementById('newVacationForm').reset();
    document.getElementById('vacationId').value = '';
    isEditing = false;
    document.querySelector('.add-button').textContent = '+';  
};