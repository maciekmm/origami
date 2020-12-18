% This template was designed for the final projects of first-cycle studies in Computer Science 
% at Faculty of Computer Science, Electronics and Telecommunications
% at AGH University of Science and Technology 

% Version: 1.2
% Version date: 2017.10.26

\NeedsTeXFormat{LaTeX2e} %
\ProvidesClass{aghthesis}

\def\titlePL#1        {\gdef\@titlePL{#1}}
\def\titleEN#1        {\gdef\@titleEN{#1}}
\def\faculty#1      {\gdef\@faculty{#1}}
\def\thesistype#1   {\gdef\@thesistype{#1}}
\def\fieldofstudy#1   {\gdef\@fieldofstudy{#1}}
\def\supervisor#1   {\gdef\@supervisor{#1}}

% DECLARING OPTIONS

\DeclareOption{polish}
{
	\newcommand*{\LangPrimaryTitle}{\@titlePL}
	\newcommand*{\LangSecondaryTitle}{\@titleEN}
	
	\newcommand*{\SectionTitleProjectVision}{Cel prac i wizja produktu}
	\newcommand*{\SectionTitleScope}{Zakres funkcjonalno\'sci}	
	\newcommand*{\SectionTitleImplementationAspects}{Wybrane aspekty realizacji}
	\newcommand*{\SectionTitleWorkOrganization}{Organizacja pracy}
	\newcommand*{\SectionTitleResults}{Wyniki projektu}	
}

\DeclareOption{english}
{
	\newcommand*{\LangPrimaryTitle}{\@titleEN}
	\newcommand*{\LangSecondaryTitle}{\@titlePL}
	
	\newcommand*{\SectionTitleProjectVision}{Project goals and vision}
	\newcommand*{\SectionTitleScope}{Functional scope}
	\newcommand*{\SectionTitleImplementationAspects}{Selected implementation aspects}
	\newcommand*{\SectionTitleWorkOrganization}{Work organization}
	\newcommand*{\SectionTitleResults}{Project results}
}

\newcommand*{\LangAgh}{Akademia G\'{o}rniczo-Hutnicza\\[2mm] im. Stanis\l{}awa Staszica w Krakowie}
\newcommand*{\LangFaculty}{Wydzia{\l} Informatyki, Elektroniki i Telekomunikacji}
\newcommand*{\LangDepartment}{Katedra Informatyki}
\newcommand*{\LangFieldOfStudy}{Kierunek:}
\newcommand*{\LangSupervisor}{Opiekun:}
\newcommand*{\LangStatementBody}{Uprzedzony(-a) o odpowiedzialności karnej na podstawie art. 115 ust. 1 i 2 ustawy z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych (t.j. Dz.U. z 2018 r. poz. 1191 z późn. zm.): „Kto przywłaszcza sobie autorstwo albo wprowadza w błąd co do autorstwa całości lub części cudzego utworu albo artystycznego wykonania, podlega grzywnie, karze ograniczenia wolności albo pozbawienia wolności do lat 3. Tej samej karze podlega, kto rozpowszechnia bez podania nazwiska lub pseudonimu twórcy cudzy utwór w wersji oryginalnej albo w postaci opracowania, artystyczne wykonanie albo publicznie zniekształca taki utwór, artystyczne wykonanie, fonogram, wideogram lub nadanie.”, a także uprzedzony(-a) o odpowiedzialności dyscyplinarnej na podstawie art. 307 ust. 1 ustawy z dnia 20 lipca 2018 r. Prawo o szkolnictwie wyższym i nauce (Dz. U. 
z 2018 r. poz. 1668 z późn. zm.) „Student podlega odpowiedzialności dyscyplinarnej za naruszenie przepisów obowiązujących w uczelni oraz za czyn uchybiający godności studenta.”, oświadczam, że niniejszą pracę dyplomową wykonałem(-am) osobiście i samodzielnie i nie korzystałem(-am) ze źródeł innych niż wymienione w pracy.

\medskip

Jednocześnie Uczelnia informuje, że zgodnie z art. 15a ww. ustawy o prawie autorskim 
i prawach pokrewnych Uczelni przysługuje pierwszeństwo w opublikowaniu pracy dyplomowej studenta. Jeżeli Uczelnia nie opublikowała pracy dyplomowej w terminie 
6 miesięcy od dnia jej obrony, autor może ją opublikować, chyba że praca jest częścią utworu zbiorowego. Ponadto Uczelnia jako podmiot, o którym mowa w art. 7 ust. 1 pkt 1 ustawy z dnia 20 lipca 2018 r. – Prawo o szkolnictwie wyższym i nauce (Dz. U. z 2018 r. poz. 1668 z późn. zm.), może korzystać bez wynagrodzenia i bez konieczności uzyskania zgody autora z utworu stworzonego przez studenta w wyniku wykonywania obowiązków związanych z odbywaniem studiów, udostępniać utwór ministrowi właściwemu do spraw szkolnictwa wyższego i nauki oraz korzystać z utworów znajdujących się w prowadzonych przez niego bazach danych, w celu sprawdzania z wykorzystaniem systemu antyplagiatowego. Minister właściwy do spraw szkolnictwa wyższego i nauki może korzystać z prac dyplomowych znajdujących się w prowadzonych przez niego bazach danych w zakresie niezbędnym do zapewnienia prawidłowego utrzymania i rozwoju tych baz oraz współpracujących 
z nimi systemów informatycznych.}
\newcommand*{\LangSignature}{(czytelne podpisy studentów)}
\newcommand*{\LangThesisType}{\textbf{Projekt dyplomowy}}

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}


% PROCESSING OPTIONS
\ProcessOptions
\LoadClass[a4paper,twoside]{article}


\RequirePackage{setspace}
\RequirePackage{times}
\RequirePackage[T1]{fontenc}
\RequirePackage{graphicx}
\RequirePackage{geometry}
\RequirePackage[usenames]{color}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{babel}



\addto\captionspolish{%
  \def\bibname{Materia{\l}y {\'z}r{\'o}d{\l}owe}%
  \def\refname{Materia{\l}y {\'z}r{\'o}d{\l}owe}%
  \def\listtablename{Spis tabel}%
  \def\tablename{Tabela}%
}


\geometry{bindingoffset=10mm, lmargin=20mm, rmargin=20mm, tmargin=25mm, bmargin=25mm, foot=10mm, head=10mm}


\renewcommand{\baselinestretch}{1.1}


%\bibliographystyle{abbrv}

%------------------------------------------------------------------------------


\renewcommand{\maketitle}{%


\newpage \titlepage

\begin{center}

%{\Large{\bfseries{\textsc \LangAgh}}}

%\vspace*{1mm}\rule{.9\textwidth}{1mm}\vspace*{1mm}
\includegraphics[width=\linewidth]{assets/aghlogo.png}
\vspace*{-0.1cm}

{\large \bfseries \textsc \LangFaculty}\vspace*{2mm}
{\large \textsc \LangDepartment}\vspace*{1cm}

%\includegraphics[width=90pt,viewport=250 350 350 500]{agh.pdf}

\vspace*{0.8cm}
{\Large\scshape \LangThesisType}\\
\vspace*{1.0cm}

\doublespacing
{\Large{\bfseries\scshape \LangPrimaryTitle}}\\
\vspace*{0.3cm}

\doublespacing
{\large{\scshape \LangSecondaryTitle}}\\
\vspace*{1.0cm}

% {\large\bfseries\scshape \@author}\\
% %\vspace*{5cm}
% \vfill
% 
% \singlespacing
% \vspace*{0.3cm}

% \large{\scshape \LangFieldOfStudy}\\
% {\@fieldofstudy}
% \vfill
% \vspace*{0.3cm}
% \large{\scshape \LangSupervisor}\\
% {\@supervisor}
% \vfill
\end{center}
\vfill
\begin{tabular}{ l l }
	Autorzy: & \@author \\
	Kierunek studiów: & Informatyka \\
	Typ studiów: & Stacjonarne \\
	Opiekun pracy: & \@supervisor
\end{tabular}

\begin{center}

% \rule{.7\textwidth}{1mm}\\
\vspace*{1cm}
{\large Krak\'{o}w, \@date}
\end{center}



\newpage
\thispagestyle{empty} 

{~~}\vspace{10mm}

\centerline{\textbf{Oświadczenie studenta}}

\vspace{10mm}

\LangStatementBody

\vspace{1.5cm}

\begin{flushright}
\makebox[6cm][s]{\dotfill}\par
\vspace{10mm}
\makebox[6cm][s]{\dotfill}\par
\makebox[6cm][c]{\small \LangSignature}
\end{flushright}

%------------------------------------------------------------------------------

\clearpage
\setcounter{page}{3}

}

%\ProcessOptions

\pagestyle{fancy}
\renewcommand{\sectionmark}[1]{\markright{\thesection.\ #1}}
\renewcommand{\headrulewidth}{0.5pt}
\fancyhf{}
\fancyhead{}

\fancyhead[LE]{\bfseries \thepage}
\fancyhead[RO]{\bfseries \thepage}

\frenchspacing
\sloppy
\widowpenalty     9999
\clubpenalty      9999
\flushbottom




\titleformat{\section}[block]
{\bfseries\Large}{\filright \Large\thesection. }{0ex}{}
\titleformat{\subsection}[block]
{\bfseries\large}{\filright \large\thesubsection. }{0ex}{}
\titleformat{\subsubsection}[block]
{\bfseries\normalsize}{\filright \normalsize\thesubsubsection. }{0ex}{}
