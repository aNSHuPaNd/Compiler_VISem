import streamlit as st
import subprocess
import os
import tempfile

st.set_page_config(page_title="Ansh Compiler", layout="wide")

st.title("Ansh Compiler")
st.write("Write, compile, and execute your Ansh programs.")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CPP_FILE = os.path.join(BASE_DIR, "main.cpp")
# EXE_FILE = os.path.join(BASE_DIR, "main.exe")

# Store the executable in a writable directory without .exe so that streamlit can make linux executable files
EXE_FILE = os.path.join(tempfile.gettempdir(), "main")


# Compile the C++ compiler
if not os.path.exists(EXE_FILE) or (
    os.path.getmtime(CPP_FILE) > os.path.getmtime(EXE_FILE)
):
    result = subprocess.run(
        ["g++", CPP_FILE, "-o", EXE_FILE],
        capture_output=True,
        text=True,
        cwd=BASE_DIR
    )

    if result.returncode != 0:
        st.error("Compiler compilation failed.")
        st.code(result.stderr)
        st.stop()

st.subheader("Code Editor")

code = st.text_area(
    "Enter Ansh code",
    value="val x = 2;\nval y = x + 8;\nprt(y);",
    height=250
)

if st.button("Compile & Run", type="primary"):
    if not code.strip():
        st.warning("Please enter some code.")
    else:
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                input_file = os.path.join(BASE_DIR, "AJ.Ansh")

                with open(input_file, "w", encoding="utf-8") as f:
                    f.write(code)

                result = subprocess.run(
                    [EXE_FILE, input_file],
                    capture_output=True,
                    text=True,
                    timeout=10,
                    cwd=BASE_DIR
                )

                st.subheader("Output")

                if result.returncode == 0:
                    st.success("Execution completed.")
                else:
                    st.error("Compilation or execution failed.")

                if result.stdout:
                    st.code(result.stdout)

                if result.stderr:
                    st.code(result.stderr)

                if not result.stdout and not result.stderr:
                    st.info("Program finished without output.")

        except subprocess.TimeoutExpired:
            st.error("Execution timed out.")
        except Exception as e:
            st.error(str(e))