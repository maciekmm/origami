all: *.tex
	latexmk -pdf thesis.tex
	latexmk -pdf presentation.tex

presentation: presentation.tex
	latexmk -pdf presentation.tex

thesis: thesis.tex
	latexmk -pdf thesis.tex

clean:
	-rm *.gz
	-rm thesis.pdf
	-rm presentation.pdf
	-rm *.fdb_latexmk
	-rm *.aux
	-rm *.lot
	-rm *.bbl
	-rm *.toc
	-rm *.blg
	-rm *.log
	-rm *.out
	-rm *.fls
