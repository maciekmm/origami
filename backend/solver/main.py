import sys

from origuide.loader import solve_fold


def main():
    if len(sys.argv) != 2:
        print('Usage: python main.py <fold_file>')
        sys.exit(1)

    fold_path = sys.argv[1]
    solved = solve_fold(fold_path)
    # if CONFIG['PROFILE']:
    #     import cProfile
    #     cProfile.runctx('solver.solve(fold_producer)', None, locals(), sort='cumulative')
    # else:
    #     solver.solve(fold_producer)

    with open("/tmp/test.fold", "w") as file:
        file.write(solved)


if __name__ == '__main__':
    main()
