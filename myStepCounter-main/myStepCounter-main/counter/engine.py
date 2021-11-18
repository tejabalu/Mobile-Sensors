import numpy as np

## TODO: Code for loading and visualizing accelerometer data
def count_steps(url):
    accel = np.array(url)
    x = np.array(accel[:,1])
    y = np.array(accel[:,2])
    z = np.array(accel[:,3])
    t = np.array(accel[:,0])
    points = np.diff(np.diff(z) < 0)
    points = [i[0] for i in np.argwhere(points)]
    points2 = [i[0] for i in np.argwhere(np.fabs(z[1:-1][points])>1)]
    steps = 0
    for index, time in enumerate(t[1:-1][points][points2][:-1]):
        if (z[1:-1][points][points2][index] > 0 and
            z[1:-1][points][points2][index+1] < 0):
            time_down = t[1:-1][points][points2][index+1]

            # if the time delta is less than 1 sec
            # if time_down - time <= 1:
            steps += 1
    # print(steps)

    zgfull = np.array(accel[:,4])
    zg = zgfull[-50:] + 9.9

    rmszg = np.sqrt(np.mean(zg**2))

    x = x[-50:]
    y = y[-50:]
    z = z[-50:]
    rmsx = np.sqrt(np.mean(x**2))
    rmsy = np.sqrt(np.mean(y**2))
    rmsz = np.sqrt(np.mean(z**2))
    absacc = np.mean([rmsx, rmsy, rmsz])


    if (19<rmszg<21):
        text = "The phone is still and facing up."
    elif (rmszg<2):
        text = "The phone is still and facing down."
    elif (absacc<1):
        text = "The phone is still."
    else:
        text = " "
    
    stepst = str(steps) + " " + text 

    return stepst