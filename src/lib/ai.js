export const requestLlama = (req) => new Promise((resolve, reject) => {
    fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": req
                        }
                    ]
                }
            ]
        })
    }).then((response) => response.json()).then((data) => {
        if (data.choices && data.choices.length > 0) {
            resolve(data.choices[0].message);
        } else {
            console.log(data);
            reject('No choices returned from AI');
        }
    }).catch((error) => {
        console.log(data);
        reject(error);
    });
});
