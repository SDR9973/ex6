const url = 'http://localhost:5001';

window.onload = async () => {
    try {
        eventListeners();
    }
    catch (error) {
        console.error(error);
    }
};

eventListeners = () => {
    document.getElementById('newVacationForm').addEventListener(`submit`, (event) => {
        event.preventDefault();
        submitVacation(event);
    });
};

submitVacation = async (event) => {
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const price = Number(formData.get('price'));
    const location = formData.get('location');
    const imageUrl = formData.get('imageUrl');
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
        console.log(data)
    }
    catch (error) {
        console.error('Error submitting vacation:', error);
    }
};