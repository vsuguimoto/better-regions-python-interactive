# region Imports
import numpy as np
import pandas as pd
from typing import List, Dict
# endregion


# region Data Processing
# region Loading
def load_data(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


# endregion


# region Cleaning
def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    return df.dropna()


# endregion
# endregion


# region Visualization
def plot_results(data: Dict):
    import matplotlib.pyplot as plt

    plt.plot(data["x"], data["y"])
    plt.show()


# endregion


# region Main
def main():
    # region Setup
    config = {"path": "data.csv"}
    # endregion
    

    # region Execution
    df = load_data(config["path"])
    df = clean_data(df)
    # endregion

    print("Done!")


if __name__ == "__main__":
    main()
# endregion
