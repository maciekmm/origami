from setuptools import setup, find_namespace_packages

setup(
    name='origuide-solver',
    version='0.1',
    packages=find_namespace_packages(include=['origuide.*', 'origuide']),
    url='https://origuide.wtf/',
    license='GPL-3.0',
    author='',
    author_email='',
    description='Origami simulator',
    install_requires=[
        "cffi>=1.14,<2",
        "numpy>=1.19,<2",
        "readline>=6.2,<7",
        "scipy>=1.5,<2"
    ]
)
