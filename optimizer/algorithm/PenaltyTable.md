# BoilerAlgo Penalty Table

This document contains a list of the penalties that are imposed on output of the algorithm in the fitness evaluation process

# Required Penalties
Penalties for failing to meet required componets are theoretically infinite as any of such issues means that the schedule is unsatisfiable, but they can be cast down to finite values for debugging and usability purposes (ie avoiding negative values when adding penalty scores together). $n$ denotes an invalid entry of the given type. The overall formula is $\rho = \sum_{i=0}^n p_i$, where $\rho$ is the overall score, $n$ is the number of courses to be scored, and $p_i$ is the penalty incurred by the $i$-th term. 

1. Invalid (null) class in list ($10$)
2. Time conflicts, that is two classes occur during some common interval of time ($100$)
3. Name conflicts, that is multiple classes in the schdule are the same ($1000$)
4. Unfulfilled requirements, that is a class that is marked as required is not present in the schedule ($10000$)

# Optional Penalties
When working with optional fields such as Rate My Professor or time of day preferences, there is rarely a valid solution that achieves the best case where the best section of each class is used. Instead, we assigned penalties based on the distance between the ideal case for the schedule and the actual case in the schedule that is generated. Next, we assign weights to each of the various components and follow the general form $\omicron=\sum_{i=0}^n p_iw_i$, where $\omicron$ is the total socre, $i$ is an element between 0 and the maximum number of parameters of optimization, $n$, $p_i$ is the value of the $i$-th paremeter, and $w_i$ is the weight of the $i$-th parameter. It follows that a lower overall score is ideal as we wish to minimize the overall score. 



# Overall Evaluation
We apply the formula $\sigma = \frac{1}{1+\omicron + \rho}$, where $\sigma$ is the total score for some generation. Therefore, it follows that as $\rho, \omicron$ tend to zero ($\rho, \omicron \to 0$)