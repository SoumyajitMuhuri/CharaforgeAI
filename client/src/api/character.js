export async function getCharacters() {
    const response = await fetch('/api/characters')
    if(!response.ok){
        const errorData= await response.json()
        throw new Error(errorData.error)
    }
    return response.json();    
}

export async function createCharacter(name,description) {
    const response = await fetch('/api/characters',{
        method:'POST',
        headers:{'Content-Type' : 'application/json'

        },
        body:JSON.stringify({
            name,description
        })
    })
    if(!response.ok){
        const errorData = await response.json()
        throw new Error(errorData.error)
    }
    return response.json()
}

