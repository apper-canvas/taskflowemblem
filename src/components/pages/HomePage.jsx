import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { taskService, categoryService } from '@/services'
import Header from '@/components/organisms/Header'
import CategorySidebar from '@/components/organisms/CategorySidebar'
import TaskList from '@/components/organisms/TaskList'
import TaskModal from '@/components/organisms/TaskModal'
import EmptyState from '@/components/molecules/EmptyState'
import LoadingState from '@/components/molecules/LoadingState'

const HomePage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    loadData()
  }, [showArchived])

  useEffect(() => {
    filterTasks()
  }, [tasks, selectedCategory, selectedPriority, selectedStatus, searchQuery, showArchived])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksData, categoriesData] = await Promise.all([
        showArchived ? taskService.getArchived() : taskService.getActive(),
        categoryService.getAll()
      ])
      
// Update category task counts
      const updatedCategories = categoriesData.map(category => ({
        ...category,
        taskCount: tasksData.filter(task => task.category === category.Name).length
      }))
      
      setTasks(tasksData)
      setCategories(updatedCategories)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = [...tasks]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      )
    }

    // Category filter
if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory)
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'completed') {
        filtered = filtered.filter(task => task.completed)
      } else if (selectedStatus === 'pending') {
        filtered = filtered.filter(task => !task.completed)
      }
    }

    setFilteredTasks(filtered)
  }

const handleCreateTask = async (taskData) => {
    try {
      // Map UI field names to database field names
      const dbTaskData = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority,
        due_date: taskData.due_date || taskData.dueDate
      };
      
      const newTask = await taskService.create(dbTaskData)
      setTasks(prev => [newTask, ...prev])
      setShowModal(false)
      toast.success('Task created successfully!')
    } catch (error) {
      toast.error('Failed to create task')
    }
  }

const handleUpdateTask = async (taskData) => {
    try {
      // Map UI field names to database field names
      const dbTaskData = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority,
        due_date: taskData.due_date || taskData.dueDate
      };
      
      const updatedTask = await taskService.update(editingTask.Id, dbTaskData)
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ))
      setShowModal(false)
      setEditingTask(null)
      toast.success('Task updated successfully!')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed })
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ))
      toast.success(completed ? 'Task completed!' : 'Task marked as incomplete')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleArchiveTask = async (taskId) => {
    try {
      await taskService.archive(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task archived successfully!')
    } catch (error) {
      toast.error('Failed to archive task')
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        showArchived={showArchived}
        onToggleArchived={setShowArchived}
        onAddTask={() => setShowModal(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <main className="flex-1 overflow-hidden">
          {filteredTasks.length === 0 && !loading ? (
            <EmptyState 
              hasFilters={searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all'}
              onAddTask={() => setShowModal(true)}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onArchiveTask={handleArchiveTask}
              showArchived={showArchived}
            />
          )}
        </main>
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
categories={categories.map(cat => cat.Name)}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowModal(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default HomePage