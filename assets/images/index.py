from rembg import remove
from PIL import Image

input = Image.open("waste.png")

output = remove(input)
output.save("splashicon.png")