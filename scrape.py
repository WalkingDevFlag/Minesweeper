import requests
import os
import re

def download_minesweeper_assets(base_url="https://minesweeperonline.com", output_dir="downloads"):
    """
    Downloads flag.png and sprite100.gif from minesweeperonline.com and saves them to a local directory.
    """
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Download homepage HTML
    response = requests.get(base_url)
    response.raise_for_status()
    html = response.text

    # Find the asset filenames
    assets = set(re.findall(r'(sprite100\.gif)', html))

    # Download each asset
    for asset in assets:
        asset_url = f"{base_url}/{asset}"
        print(f"Fetching {asset_url}...")
        r = requests.get(asset_url)
        r.raise_for_status()
        file_path = os.path.join(output_dir, asset)
        with open(file_path, 'wb') as f:
            f.write(r.content)
        print(f"Saved {asset} to {file_path}")

if __name__ == "__main__":
    download_minesweeper_assets()
