# Backend

## Environment setup

### Pypy

We **highly** recommend using Pypy.
It makes things run almost 10x faster.

```bash
python -m virtualenv venv
source venv/bin/activate
pip install -r requirements-pypy.txt

# Next - build matplotlib from sources
git clone git://github.com/matplotlib/matplotlib.git
cd matplotlib
git checkout v3.0.3
python -mpip install .
cd ..
rm -rf matplotlib
```

### CPython

```bash
python -m virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Developing

Start by activating virtual env:
```bash
source venv/bin/activate
```

## Testing
You need to be in `origuide` directory.

```bash
python -m unittest
```
