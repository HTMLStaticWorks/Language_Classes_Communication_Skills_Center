import glob

favicon_block = """  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">"""

html_files = glob.glob("*.html")
for fpath in html_files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    if '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">' in content:
        new_content = content.replace('<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">', favicon_block)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Updated:", fpath)
    elif "<!-- Favicon -->" not in content and "</head>" in content:
        new_content = content.replace("</head>", f"{favicon_block}\n</head>")
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Inserted into:", fpath)
