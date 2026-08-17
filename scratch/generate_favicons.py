import os
import subprocess
from PIL import Image

workspace_dir = os.path.abspath(".")
svg_path = os.path.join(workspace_dir, "assets", "favicon.svg")
raw_png_path = os.path.join(workspace_dir, "assets", "favicon-512.png")

edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_exe):
    edge_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

svg_url = "file:///" + svg_path.replace("\\", "/")

# Create a temporary HTML file wrapping the SVG to guarantee background transparency and exact 512x512 rendering
html_wrapper = os.path.join(workspace_dir, "scratch", "favicon_render.html")
os.makedirs(os.path.dirname(html_wrapper), exist_ok=True)

with open(html_wrapper, "w", encoding="utf-8") as f:
    f.write(f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 512px; height: 512px; background: transparent; overflow: hidden; }}
  img {{ width: 512px; height: 512px; display: block; }}
</style>
</head>
<body>
  <img src="{svg_url}" width="512" height="512">
</body>
</html>
""")

html_url = "file:///" + html_wrapper.replace("\\", "/")

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--force-device-scale-factor=1",
    "--hide-scrollbars",
    "--default-background-color=00000000",
    f"--screenshot={raw_png_path}",
    "--window-size=512,512",
    html_url
]

print("Rendering SVG to PNG via headless browser...")
subprocess.run(cmd, check=True)

if os.path.exists(raw_png_path):
    img = Image.open(raw_png_path)
    print("Base PNG created:", img.size, img.mode)
    
    # Crop to content if needed or resize directly
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # 1. Save PNG versions in assets/
    img_512.save(os.path.join(workspace_dir, "assets", "favicon-512.png"))
    
    img_192 = img_512.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(workspace_dir, "assets", "favicon-192.png"))
    
    img_180 = img_512.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save(os.path.join(workspace_dir, "assets", "apple-touch-icon.png"))
    
    img_32 = img_512.resize((32, 32), Image.Resampling.LANCZOS)
    img_32.save(os.path.join(workspace_dir, "assets", "favicon-32x32.png"))
    
    img_16 = img_512.resize((16, 16), Image.Resampling.LANCZOS)
    img_16.save(os.path.join(workspace_dir, "assets", "favicon-16x16.png"))
    
    # 2. Save .ico in root and assets/
    ico_path_root = os.path.join(workspace_dir, "favicon.ico")
    ico_path_assets = os.path.join(workspace_dir, "assets", "favicon.ico")
    
    img_512.save(ico_path_root, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    img_512.save(ico_path_assets, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    
    print("All PNGs and ICO files successfully created!")
