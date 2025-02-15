#!/usr/bin/env python3
import sys
import json
import base64
from google import genai
from google.genai import types

def generate_image(api_key, prompt, width, height):
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_images(
            model='imagen-3.0-generate-002',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                size=types.Size(width=width, height=height)
            )
        )
        
        if not response.generated_images:
            return json.dumps({
                'success': False,
                'error': 'No images generated'
            })
        
        # Get the first generated image
        image_bytes = response.generated_images[0].image.image_bytes
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        return json.dumps({
            'success': True,
            'image': base64_image,
            'response': response.dict()
        })
    except Exception as e:
        return json.dumps({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    # Expect: api_key prompt width height
    if len(sys.argv) != 5:
        print(json.dumps({
            'success': False,
            'error': 'Invalid arguments. Expected: api_key prompt width height'
        }))
        sys.exit(1)
    
    api_key = sys.argv[1]
    prompt = sys.argv[2]
    width = int(sys.argv[3])
    height = int(sys.argv[4])
    
    print(generate_image(api_key, prompt, width, height))
